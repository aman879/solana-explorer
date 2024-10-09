import React from "react";
import { Link } from "react-router-dom";

const Navbar = ( ) => {

  return (
    <div className="fixed z-10 backdrop-blur-sm pt-3 pb-2">
      <section className="relative mx-auto">
        <nav className="flex justify-between items-center text-white w-screen px-24">
          <div className="flex items-center">
            <Link className="text-3xl font-bold font-heading" to="/">Ingnitus Network</Link>
          </div>

          <ul className="flex space-x-12 font-semibold font-heading">
            <li>
                <Link className='no-underline text-gray-200' to="/explorer">Explorer</Link>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default Navbar;