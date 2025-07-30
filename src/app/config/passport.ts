/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

// Import Google OAuth for comparison checks (Google users login differently)
// import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";


// Login user with email and password  (for users who registered manually).
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",     // By default, 'username' is used — override to use 'email'
            passwordField: "password"   // Specify the password field from the login form
        },
        async (email: string, password: string, done) => {
            try {
                // Step 1: Find user by email
                const isUserExist = await User.findOne({ email });

                if (!isUserExist) {
                    return done("User does not exist")
                }
                if (isUserExist.status === Status.BLOCKED) {
                    return done(`User is ${Status.BLOCKED}`)
                }

                // Step 2: Check if the user previously authenticated using Google OAuth
                // const isGoogleAuthenticated = isUserExist.auths.some( providerObjects => providerObjects.provider === "google" );

                // if (isGoogleAuthenticated && !isUserExist.password) {
                //     // If user signed up with Google and has no password set,
                //     // inform them to set a password first via Google login
                //     return done(null, false, {
                //         message:
                //             "You have authenticated through Google. So if you want to login with credentials, then at first login with Google and set a password for your Gmail and then you can login with email and password."
                //     });
                // }

                // Step 3: Check submitted password with the password stored in Database
                const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string );

                if (!isPasswordMatched) {
                    return done(null, false, { message: "Password does not match" });
                }

                // Step 4: All checks passed — return the user to Passport
                return done(null, isUserExist);
            } catch (error) {
                // Catch and handle any unexpected errors (e.g., DB issues)
                console.log(error);
                done(error);
            }
        }
    )
);

// This function tells Passport how to store user data in the session (during login)
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
// Only the user's unique identifier (MongoDB _id) is saved in the session
// This keeps the session lightweight instead of storing the whole user object
done(null, user._id);
});

// This function is used by Passport to retrieve full user details from the session on each request
passport.deserializeUser(async (id: string, done: any) => {
try {
    // Fetch the full user object from the database using the ID stored in session
    const user = await User.findById(id);

    // Attach the user object to the request (req.user)
    done(null, user);   /* Like in the JWT:  req.user = verifyToken */
} catch (error) {
    // If an error occurs during DB lookup, handle it gracefully
    console.log(error);
    done(error);
}
});