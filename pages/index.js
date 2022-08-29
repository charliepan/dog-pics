import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [dogs, setDogs] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    fetch("https://dog.ceo/api/breeds/image/random/11")
      .then((res) => res.json())
      .then((data) => {
        setDogs(data?.message || []);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <p className="flex items-center justify-center h-screen">Loading...</p>
    );
  }

  const upperCase = (dogBreed) => {
    if (!dogBreed.includes("-")) {
      return dogBreed.charAt(0).toUpperCase() + dogBreed.slice(1);
    }
    const dogWords = dogBreed.split("-");
    return dogWords
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const findBreed = (dog) => {
    const regex = /\/breeds\/(.*)\//;
    const foundDogBreed = dog.match(regex);
    return foundDogBreed && upperCase(foundDogBreed[1]);
  };

  const otherDogs =
    dogs?.slice(1).map((dog) => {
      return {
        url: dog,
        breed: findBreed(dog),
      };
    }) || [];

  return (
    <div>
      <Head>
        <title>Doggo Generator</title>
        <meta name="description" content="A dog pic generator app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-center py-2">Doggo of the day:</h1>
      <div className="block container mx-auto w-64 h-64">
        <Image
          className="rounded-md py-2 "
          src={`${(dogs && dogs[0]) || "/"}`}
          alt="featured-dog"
          width={250}
          height={250}
          layout="responsive"
        />
      </div>
      {otherDogs &&
        otherDogs.map((dog) => {
          return (
            <div
              key={dog.url}
              className="flex items-center justify-center py-2"
            >
              <a
                className="hover:text-teal-500"
                href={dog.url}
                target="_blank"
                rel="noreferrer"
              >
                {dog.breed}
              </a>
            </div>
          );
        })}
    </div>
  );
}
