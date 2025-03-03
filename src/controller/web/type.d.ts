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
  button: {
    name: string;
    path: string;
  };
  defaultProfileImage: string;
}

export default NavbarType;
