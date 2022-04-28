import sanityClient from "@sanity/client";
import dotenv from "dotenv";
dotenv.config();

export default sanityClient({
    projectId: "",
    dataset: "production",
    useCdn: false,
    apiVersion: "2022-04-02",
    token: process.env.SANITY_API_TOKEN,
});
