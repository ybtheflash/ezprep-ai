"use client";
import { createCode } from "@/lib/actions/redeemCode";
import { RedemptionCode } from "@/models/RedemptionCodes";
import { useState } from "react";

export function CreateCodes() {
  const [code, setCode] = useState("");
  const handleClick = async () => {
      const respone = await createCode(code);
  }
  return (
    <div>
      <input onChange={(e) => {setCode(e.target.value)}}></input>
      <div>
        {code}
      </div>
      <button onClick={handleClick}>Create Code</button>
    </div>
  )
}