"use client";

import { useEffect, useState } from "react";
import { DEFAULT_USER_IMAGE } from "@/lib/constants";
import { getUserAvatarUrl } from "@/lib/user/display-name";
import type { IUser } from "@/types/user";

type UserAvatarProps = {
  user?: IUser | null;
  src?: string | null;
  alt?: string;
  className?: string;
};

/**
 * Google/OAuth avatar URLs often 403 without referrerPolicy="no-referrer".
 */
export default function UserAvatar({
  user,
  src,
  alt = "",
  className,
}: UserAvatarProps) {
  const resolvedSrc = src?.trim() || getUserAvatarUrl(user);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setCurrentSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (currentSrc !== DEFAULT_USER_IMAGE) {
          setCurrentSrc(DEFAULT_USER_IMAGE);
        }
      }}
    />
  );
}
