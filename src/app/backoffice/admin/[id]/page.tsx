"use client";
import dynamic from "next/dynamic";
import * as React from "react";
import { useParams } from "next/navigation";

const TemplateEditor = dynamic(() => import("@/page-components/backoffice/admin/TemplateEditor"), {
  ssr: false,
  loading: () => null,
});

export default function EditFormPage() {
  const params = useParams();
  const formId = params.id as string;

  return <TemplateEditor mode="edit" templateId={formId} />;
}