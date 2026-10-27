"use client";

import { Save, Trash2 } from "lucide-react";
import * as React from "react";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "@/components/ui/toast";

const categories = [
  "Beach",
  "Adventure",
  "Cultural",
  "Nature",
  "City Break",
  "Luxury",
  "Wildlife",
  "Budget",
] as const;

type FormState = {
  destinationName: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  destinationName: "",
  country: "",
  category: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.destinationName.trim()) {
    errors.destinationName = "Destination name is required";
  }

  if (!form.country.trim()) {
    errors.country = "Country is required";
  }

  if (!form.category) {
    errors.category = "Select a category";
  }

  if (!form.price.trim()) {
    errors.price = "Price is required";
  } else if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
    errors.price = "Enter a price greater than 0";
  }

  if (!form.duration.trim()) {
    errors.duration = "Duration is required, e.g. 7 Days/6 Nights";
  }

  if (!form.departureDate) {
    errors.departureDate = "Departure date is required";
  } else {
    const selected = new Date(`${form.departureDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.departureDate = "Departure date cannot be in the past";
    }
  }

  if (!form.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required";
  } else {
    try {
      const url = new URL(form.imageUrl.trim());
      if (!/^https?:$/.test(url.protocol)) {
        errors.imageUrl = "Enter a valid http(s) URL";
      }
    } catch {
      errors.imageUrl = "Enter a valid URL, e.g. https://example.com/image.jpg";
    }
  }

  if (!form.description.trim()) {
    errors.description = "Please describe the travel experience";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

const filledControlClassName =
  "rounded-md border border-transparent bg-muted px-3.5 transition-colors focus-visible:border-ring focus-visible:bg-background";

const controlClassName = `h-10 ${filledControlClassName}`;

export default function AddDestinationPage() {
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [errors, setErrors] = React.useState<FormErrors>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("http://localhost:5000/add-destination", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    toast.add({
      title: "Travel package added",
      description: `“${form.destinationName.trim()}” is now live on Wanderlast.`,
      type: "success",
    });

    setForm(initialForm);
    setErrors({});
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            Add New Travel Package
          </h1>

          <Card className="mx-auto mt-10 w-full max-w-2xl gap-6 shadow-xs [--card-spacing:1.75rem]">
            <CardContent>
              <form
                id="add-travel-package-form"
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-5 sm:grid-cols-2"
              >
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="destinationName">Destination Name</Label>
                  <Input
                    id="destinationName"
                    name="destinationName"
                    placeholder="Bali Paradise"
                    value={form.destinationName}
                    onChange={(event) =>
                      update("destinationName", event.target.value)
                    }
                    aria-invalid={!!errors.destinationName}
                    className={controlClassName}
                  />
                  <FieldError message={errors.destinationName} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Indonesia"
                    value={form.country}
                    onChange={(event) => update("country", event.target.value)}
                    aria-invalid={!!errors.country}
                    className={controlClassName}
                  />
                  <FieldError message={errors.country} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="category-trigger">Category</Label>
                  <Select
                    value={form.category || null}
                    onValueChange={(value) => update("category", value ?? "")}
                  >
                    <SelectTrigger
                      id="category-trigger"
                      className={`w-full ${controlClassName}`}
                      aria-invalid={!!errors.category}
                    >
                      <SelectValue placeholder="Beach" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.category} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    step="1"
                    inputMode="decimal"
                    placeholder="e.g., 1299"
                    value={form.price}
                    onChange={(event) => update("price", event.target.value)}
                    aria-invalid={!!errors.price}
                    className={controlClassName}
                  />
                  <FieldError message={errors.price} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g., 7 Days/6 Nights"
                    value={form.duration}
                    onChange={(event) => update("duration", event.target.value)}
                    aria-invalid={!!errors.duration}
                    className={controlClassName}
                  />
                  <FieldError message={errors.duration} />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    name="departureDate"
                    type="date"
                    value={form.departureDate}
                    onChange={(event) =>
                      update("departureDate", event.target.value)
                    }
                    aria-invalid={!!errors.departureDate}
                    className={controlClassName}
                  />
                  <FieldError message={errors.departureDate} />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={form.imageUrl}
                    onChange={(event) => update("imageUrl", event.target.value)}
                    aria-invalid={!!errors.imageUrl}
                    className={controlClassName}
                  />
                  <FieldError message={errors.imageUrl} />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the travel experience..."
                    value={form.description}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                    aria-invalid={!!errors.description}
                    className={`min-h-32 py-2.5 ${filledControlClassName}`}
                  />
                  <FieldError message={errors.description} />
                </div>
              </form>
            </CardContent>

            <div className="flex flex-wrap items-center justify-end gap-3 px-(--card-spacing)">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(initialForm);
                  setErrors({});
                }}
                className="h-10 gap-2 border-red-200 bg-background px-4 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 aria-hidden="true" />
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-travel-package-form"
                className="h-10 gap-2 bg-cyan-600 px-4 text-white hover:bg-cyan-700"
              >
                <Save aria-hidden="true" />
                Add Travel Package
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </>
  );
}
