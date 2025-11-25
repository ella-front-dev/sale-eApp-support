"use client";
import dynamic from "next/dynamic";
import * as React from "react";

const TemplateEditor = dynamic(() => import("@/page-components/backoffice/admin/TemplateEditor"), {
  ssr: false,
  loading: () => null,
});

export default function NewFormPage() {
  return <TemplateEditor mode="create" />;
}