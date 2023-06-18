"use client"

import Link from "next/link";

type Props = {
    title: string;
    url?: string;
    buttonText: string;
    userId: string;
    sessionUserId: string;
    onClick: () => void;
}

const SocialMedia = ({ title, url, buttonText, userId, sessionUserId, onClick }: Props) => {
    return (
        <div className="flex flex-col w-full gap-3">
            <p className="text-lg font-bold">{title}</p>
            {url ? (
                <Link href={url} target="_blank" rel="noreferrer" className="text-primary-purple">
                    {url}
                </Link>
            ) : (
                sessionUserId === userId ? (
                    <button type="button" className="flex text-primary-purple" onClick={onClick}>
                        {buttonText}
                    </button>
                ) : (
                    <p className="text-sm text-gray-100">none</p>
                )
            )}
        </div>
    );
};

export default SocialMedia