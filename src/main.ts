import "./style.css";
import { status } from "./services/ghstatus";

type Component = {
  name: string;
  status: string;
};

class GithubStatus {
  private refreshTime: HTMLElement;
  private services: HTMLElement;
  private updateInterval: number;
  private timer: number | undefined;

  constructor() {
    this.refreshTime = document.querySelector<HTMLDivElement>("#refresh-time")!;
    this.services = document.querySelector<HTMLDivElement>(".services")!;

    this.timer = undefined;
    this.updateInterval = 60;
  }

  init() {
    this.createPage();
    this.updateStatus();
  }

  async getStatus() {
    const resp = await status.get("/");
    const result = resp.data.components;

    return result
      .map(({ name, status }: Component) => ({ name, status }))
      .filter((el: Component) => el.name !== "Visit www.githubstatus.com for more information");
  }

  clearServiceHTML() {
    this.services.innerHTML = ''
  }

  createServiceHTML(data: Component[]) {
    this.clearServiceHTML()

    return data.map((element: Component) => {
      const serviceHTML = document.createElement("div");
      const nameHTML = document.createElement("div");
      const statusHTML = document.createElement("div");

      nameHTML.innerText = element.name;
      statusHTML.innerText = element.status;

      nameHTML.classList.add("service-name");
      statusHTML.classList.add("service-status");
      serviceHTML.classList.add("service");

      this.setStatusClassName(statusHTML);

      serviceHTML.appendChild(nameHTML);
      serviceHTML.appendChild(statusHTML);

      return serviceHTML
    });
  }

  insertServicesHTML(servicesHTML: HTMLElement[]) {
    for(let serviceHTML of servicesHTML) {
      this.services.appendChild(serviceHTML);
    }
  }

  setStatusClassName(element: HTMLElement) {
    switch (element.innerText) {
      case "operational":
        element.classList.add("operational");
        break;

      case "degraded_performance":
        element.classList.add("degraded_performance");
        break;

      case "partial_outage":
        element.classList.add("partial_outage");
        break;

      case "major_outage":
        element.classList.add("major_outage");
        break;

      case "under_maintenance":
        element.classList.add("under_maintenance");
        break;
    }
  }

  insertHTML(element: string) {
    this.services.innerHTML = element;
  }

  async createPage() {
    const result = await this.getStatus();
    const services = this.createServiceHTML(result);
    
    this.insertServicesHTML(services)
    this.insertHTML(this.services.innerHTML);
  }

  insertRefreshTimeValueInToHTML(value: number) {
    this.refreshTime.innerText = `${value}`;
  }

  createTimer(fn: any) {
    this.timer = setInterval(() => fn(), 1000);
  }

  startTimer() {
    let refreshTime = Number(this.updateInterval);

    this.createTimer(() => {
      refreshTime--;

      this.insertRefreshTimeValueInToHTML(refreshTime);
    });
  }

  resetTimer() {
    clearInterval(this.timer);
  }

  updateStatus() {
    this.startTimer();

    setInterval(() => {
      this.resetTimer();
      this.createPage();
      this.startTimer();
    }, this.updateInterval * 1000);
  }
}

const githubStatus = new GithubStatus();

githubStatus.init();
