"use client";
import dynamic from "next/dynamic";
import * as React from "react";

const TemplateEditor = dynamic(() => import("@/page-components/template-editor/TemplateEditor"), {
  ssr: false,
  loading: () => null,
});

export default function NewTemplatePage() {
  return <TemplateEditor mode="create" />;
}
