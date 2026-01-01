import React from "react";

type Props = {
  hero?: React.ReactNode;
  top?: React.ReactNode;
  sidebar?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export const ScoreboardLayout = ({ hero, top, sidebar, right, children }: Props) => {
  return (
    <div className="min-h-screen w-full bg-white">
      {hero ? <div className="h-120">{hero}</div> : null}
      {top}

      <div className="flex min-h-[calc(100vh-280px-78px)]">
        {sidebar}
        <main className="flex-1 bg-white">{children}</main>

        {/* keep current behavior for now */}
        {right ? <aside className="w-110 shrink-0 fixed right-12 bottom-12">{right}</aside> : null}
      </div>
    </div>
  );
}