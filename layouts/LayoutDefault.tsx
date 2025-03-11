import "./style.css";

import React from "react";
import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link.js";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      <Sidebar>
        <Logo />
        <Link href="/">Welcome</Link>
        <Link href="/todo">Todo</Link>
        <Link href="/star-wars">Data Fetching</Link>

        <Link href="/members">Members</Link>
        <SubMenu>
          <Link href="/members/manage">Manage</Link>
        </SubMenu>

        <Link href="/meetings">Meetings</Link>
        <SubMenu>
          <Link href="/meetings/manage">Manage</Link>
        </SubMenu>

        <Link href="/achievements">Achievements</Link>
        <SubMenu>
          <Link href="/achievements/sku">SKU</Link>
          <Link href="/achievements/skk">SKK</Link>
          <Link href="/achievements/spg">SPG</Link>
        </SubMenu>
      </Sidebar>
      <Content>{children}</Content>
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="sidebar"
      style={{
        padding: 20,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        lineHeight: "1.8em",
        borderRight: "2px solid #eee",
      }}
    >
      {children}
    </div>
  );
}

function SubMenu({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      id="sidebar"
      style={{
        paddingLeft: 20,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        lineHeight: "1.8em",
        borderRight: "2px solid #eee",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div
        id="page-content"
        style={{
          padding: 20,
          paddingBottom: 50,
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logoUrl} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
}
