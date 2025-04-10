import { httpRouter } from "convex/server";
import { Id } from "./_generated/dataModel";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  pathPrefix: "/getImage/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const splitUrlArray = request.url.split("/");
    const storageId = splitUrlArray[4] as Id<"_storage">;
    const blob = await ctx.storage.get(storageId);
    
    if (blob === null) {
      return new Response("Image not found", {
        status: 404,
      });
    }
    
    return new Response(blob);
  }),
});

export default http;