"use client";
import * as React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TemplateEditor = dynamic(() => import("@/page-components/template-editor/TemplateEditor"), {
  ssr: false,
  loading: () => null,
});

export default function EditTemplatePage() {
  const params = useParams();
  const templateId = params.id as string;

  return <TemplateEditor mode="edit" templateId={templateId} />;
}
