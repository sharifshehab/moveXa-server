/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

// Login user with email and password  
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",     
            passwordField: "password"   
        },
        async (email: string, password: string, done) => {
            try {
                const isUserExist = await User.findOne({ email });
                if (!isUserExist) {
                    return done("User does not exist")
                }
                if (isUserExist.status === Status.BLOCKED) {
                    return done(`User is blocked`)
                }

                const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string );

                if (!isPasswordMatched) {
                    return done(null, false, { message: "Password does not match" });
                }
                return done(null, isUserExist);
            } catch (error) {
                console.log(error);
                done(error);
            }
        }
    )
);


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
try {
    const user = await User.findById(id);
    done(null, user);   
} catch (error) {
    console.log(error);
    done(error);
}
});