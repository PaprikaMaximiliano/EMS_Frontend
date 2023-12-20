import { NextComponentType, NextPageContext } from "next";
import { useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { redirect } from "next/navigation";

function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const isAuth = useAppSelector((state) => state.authReducer.isAuth);

    const redirectUser = () => {
      if (!isAuth) {
        redirect("/login");
      }
    };

    useEffect(() => {
      redirectUser();
    }, []);

    useEffect(() => {
      redirectUser();
    }, [isAuth]);

    if (!isAuth) return null;
    return <Component {...props} />;
  };
}

export default withAuth;
