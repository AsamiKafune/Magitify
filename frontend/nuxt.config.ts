// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      charset: "utf-16",
      viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      title: "Magitify",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Magitify alt spotify WebUI",
        },
        { name: "author", content: "MagicLab" },
        { name: "robots", content: "index, follow" },
        { name: "language", content: "Thailand" },
        { name: "og:title", content: "Magitify" },
        { name: "og:description", content: "Magitify alt spotify WebUI" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://pro.fontawesome.com/releases/v5.15.0/css/all.css",
        },
        {
            rel: "icon",
            type: "image/x-icon",
            href: "/logo_.png",
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      api: "https://alt-magitify.kfn.moe",
    }
  },
  css: ["~/assets/main.css"]
})