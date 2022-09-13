import React from "react";

export const Footer = () => {
  return (
    <footer className="p-4 md:px-6 md:py-8">
      <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <span className="block text-sm text-gray-500 text-center">
        Made with ❤️ by{" "}
        <a
          href="https://abhixshakya.me/"
          className="text-orange-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          AbhiXShakya
        </a>
      </span>
    </footer>
  );
};
