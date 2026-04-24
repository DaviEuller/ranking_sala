import React from "react";
import styles from './style.module.css'
import NavBar from "../NavBar/NavBar.tsx";

type ContainerProps = {
  children: React.ReactNode;
  userName?: string;
  userRole?: 'Aluno' | 'Admin';
  notificacoes?: number;
};

function Container({ children, userName, userRole, notificacoes }: ContainerProps) {
  return (
    <div className={styles.wrapper}>
      <NavBar
        userName={userName as any}
        userRole={userRole}
        notificacoes={notificacoes}
      />
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
}

export default Container;