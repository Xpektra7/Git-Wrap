"use client";
import * as React from "react";
import { redirect } from "next/navigation";

export default function Form() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
        redirect(`/${name.value.trim()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                className="outline-none rounded border border-border w-40 p-1 px-2 text-sm"
                placeholder="Username"
            />
            <button
                type="submit"
                className="bg-primary text-secondary rounded p-1 px-4 text-sm cursor-pointer"
            >
                Wrap
            </button>
        </form>

    );
}