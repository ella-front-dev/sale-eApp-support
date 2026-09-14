"use client";
import * as React from "react";

import dynamic from "next/dynamic";

const TemplateEditor = dynamic(() => import("@/page-components/template-editor/TemplateEditor"), {
  ssr: false,
  loading: () => null,
});

export default function NewTemplatePage() {
  return <TemplateEditor mode="create" />;
}
