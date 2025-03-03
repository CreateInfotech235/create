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

