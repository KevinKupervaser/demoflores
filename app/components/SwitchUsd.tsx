// "use client";
// import React from "react";
// import { useAppContext } from "../context";
// import { Switch } from "@material-tailwind/react";

// type CurrencyState = boolean;

// interface Props {
//   rest: any;
// }

// const SwitchUsd = ({ rest }: Props) => {
//   const { usd, setUsd } = useAppContext();

//   const handleClick = () => {
//     setUsd((prevState: CurrencyState) => !prevState);
//   };

//   return (
//     <div className="flex">
//       <label className="text-gray-700 font-light select-none cursor-pointer">
//         ARS
//       </label>
//       <div className="ml-4">
//         <Switch label="USD" onClick={handleClick} {...rest} />
//       </div>
//     </div>
//   );
// };

// export default SwitchUsd;
