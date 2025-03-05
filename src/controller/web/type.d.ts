import { CONTACT_US_TYPE } from "../../enum";

export interface NavbarType {
  logo: {
    img: string;
    path: string;
  };
  menuList: [
    {
      name: string;
      path: string;
    },
  ];
  favicon: {
    img: string;
    path: string;
  };
  button: {
    name: string;
    path: string;
  };
  defaultProfileImage: string;
}

export interface SocialMediaType {
  email: string;
  phoneNumber: string;
  socialMedia: [
    {
      name: string;
      link: string;
      icon: string;
    }
  ]
}


export interface HomeLandingpageType {
  AutoTyperlist: string[];
  subTitle: string;
  description: string;
  bgImage: string;
}
export interface FooterType {
  Resources: {
    name: string;
    link: string;
    _id: string; // Added _id field
  }[];
  ContactUs: {
    data: string;
    type: string;
    link: string;
  }[]; // Changed to an array of objects
  copyright: {
    text: string;
    link: string;
  };
}