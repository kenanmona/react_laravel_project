import { forwardRef } from "react";

export const InputField = forwardRef(({ name, type, ...props }, ref) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 undefined"
      >
        {name}
      </label>
      <div className="flex flex-col items-start">
        <input
          ref={ref}
          {...props}
          type={type}
          name={name}
          className="block w-full mt-1 p-1 outline-none border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    </div>
  );
});
