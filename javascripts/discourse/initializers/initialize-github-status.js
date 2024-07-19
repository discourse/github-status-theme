import { withPluginApi } from "discourse/lib/plugin-api";
export default {
  name: "initialize-github-status",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.decorateCookedElement(this.addStatusIndicators, {
        id: "github-status",
      });

      api.decorateChatMessage?.(this.addStatusIndicators, {
        id: "github-status",
      });
    });
  },

  addStatusIndicators(element) {
    const oneboxes = element.querySelectorAll(
      ".onebox.githubpullrequest, .onebox.githubissue"
    );
    oneboxes.forEach((onebox) => {
      const link = onebox.querySelector(".source a");
      if (!link) {
        return;
      }

      const isPrivate =
        onebox.querySelector(".onebox-body .github-row")?.dataset
          .githubPrivateRepo === "true";
      if (isPrivate) {
        return;
      }

      const href = link.getAttribute("href");
      const parts = href.match(
        /https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/(pull|issues)\/(\d+)/
      );
      if (!parts) {
        return;
      }

      let linkType = parts[3];
      if (linkType === "pull") {
        linkType = "pulls";
      }

      const imageSrc = `https://img.shields.io/github/${linkType}/detail/state/${parts[1]}/${parts[2]}/${parts[4]}?label=&style=flat-square`;
      const image = document.createElement("img");
      image.setAttribute("src", imageSrc);
      image.classList.add("github-status-indicator");

      const info = onebox.querySelector(".github-info");
      if (info) {
        info.appendChild(image);
      }
    });
  },
};
