import { Router, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../util";

import { DecodedRefreshToken, UserType } from "../types";
import User from "../models/UserModel";

//generate access token

const generateAccessToken = (user: UserType): string => {
  return jwt.sign(
    {
      email: user.email,
      isLoggedIn: true,
      id: user.id,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
export const generateResetToken = (user: UserType): string => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};
export const generateRefreshToken = async (user: UserType): Promise<string> => {
  const token = jwt.sign(
    {
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  user.refreshToken = token;
  await User.findOneAndUpdate({ email: user.email }, user);

  return token;
};

export const veryResetToken = async (
  token: string
): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      JWT_SECRET,
      async (err: any, decoded: { email: string; id: string }) => {
        if (err) {
          resolve(false);
        } else {
          try {
            resolve(decoded.email);
          } catch (error) {
            resolve(false);
          }
        }
      }
    );
  });
};

export const getAuthToken = async (req: Request, res: Response) => {
  const user = req["user"] as UserType;
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  res
    .status(200)
    .json({ email: user.email, accessToken, refreshToken, isLoggedIn: true });
};

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<UserType | null> => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    if (next) {
      res.status(401).json({ message: "No token provided" });
      return null;
    } else {
      return null;
    }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      if (next) {
        res.status(401).json({ message: "User not found" });
        return null;
      } else {
        return null;
      }
    }

    req["user"] = user as UserType;

    if (next) {
      next();
      return null;
    } else {
      return user;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    if (next) {
      res.status(401).json({ message: "Invalid token" });
      return null;
    } else {
      return null;
    }
  }
};

export const handleRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refresh_token = (req.headers["refresh_token"] as string) || "";
  if (!refresh_token) {
    return res.status(401).send({ message: "Invalid refresh token" });
  }

  try {
    const decodedRefreshToken = jwt.verify(
      refresh_token,
      JWT_SECRET
    ) as DecodedRefreshToken;

    if (!decodedRefreshToken) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const user = await User.findOne({ email: decodedRefreshToken.email });
    if (user.refreshToken !== refresh_token) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(401).send({ message: error });
  }
};
