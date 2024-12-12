import { ClockIcon, PhoneIcon, QueueListIcon } from "@heroicons/react/16/solid";
import {
  RiFacebookLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitchLine,
} from "@remixicon/react";

export const footerArray = {
  infoConpany: {
    title: "Informacion de la empresa",
    options: [
      {
        title: "Contact Us",
        describe: "We'd love to hear from you",
        link: "https://www.google.com",
        icono: PhoneIcon,
      },
      {
        title: "Hotarios",
        describe: "We're a team of designers and developers",
        link: "https://www.google.com",
        icono: ClockIcon,
      },
      {
        title: "Consultas",
        describe: "We're here to help",
        link: "https://www.google.com",
        icono: QueueListIcon,
      },
      {
        title: "Teléfono",
        describe: "We're hiring",
        link: "https://www.google.com",
        icono: PhoneIcon,
      },
    ],
  },

  socialMedia: {
    title: "Redes Sociales",
    options: [
      {
        title: "Facebook",
        describe: "We're hiring",
        link: "https://www.google.com",
        icono: RiFacebookLine,
      },
      {
        title: "Instagram",
        describe: "We're hiring",
        link: "https://www.google.com",
        icono: RiInstagramLine,
      },
      {
        title: "Twitter",
        describe: "We're hiring",
        link: "https://www.google.com",
        icono: RiTwitchLine,
      },
      {
        title: "Linkedin",
        describe: "we're hiring",
        link: "https://www.google.com",
        icon: "fa fa-linkedin",
        icono: RiLinkedinLine,
      },
    ],
  },
  copyright: {
    title: "Copyright",
    options: [
      {
        title: "Copyright",
        describe: "All rights reserved",
        link: "https://www.google.com",
      },
      {
        title: "Privacy Policy",
        describe: "We're hiring",
        link: "https://www.google.com",
      },
      {
        title: "Terms of Service",
        describe: "We're hiring",
        link: "https://www.google.com",
      },
    ],
  },
  clienteSupot: {
    title: "Soporte",
    options: [
      {
        title: "Preguntas frecuentes",
        describe: "We're hiring",
        link: "https://www.google.com",
      },
      {
        title: "Seguimiento a pedidos ",
        describe: "We're hiring",
        link: "https://www.google.com",
      },
      {
        title: "Nuestro servicio",
        describe: "We're hiring",
        link: "https://www.google.com",
      },
    ],
  },
};
