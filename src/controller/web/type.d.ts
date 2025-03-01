interface NavbarType {
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
}

export default NavbarType;
