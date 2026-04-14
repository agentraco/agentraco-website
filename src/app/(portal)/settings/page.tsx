"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mockRestaurant } from "@/lib/mockData";
import type { Restaurant, HoursJson } from "@/lib/types";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
];

const settingsSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  timezone: z.string().nullable(),
  transferNumber: z.string().nullable(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const defaultHours: HoursJson = {
  mon: { open: "09:00", close: "17:00", closed: false },
  tue: { open: "09:00", close: "17:00", closed: false },
  wed: { open: "09:00", close: "17:00", closed: false },
  thu: { open: "09:00", close: "17:00", closed: false },
  fri: { open: "09:00", close: "17:00", closed: false },
  sat: { open: "10:00", close: "16:00", closed: false },
  sun: { open: "10:00", close: "16:00", closed: true },
};

export default function SettingsPage() {
  // TODO: replace with real API call
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurant);
  const [hours, setHours] = useState<HoursJson>(
    restaurant.hoursJson ?? defaultHours
  );
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: restaurant.name,
      phone: restaurant.phone,
      address: restaurant.address,
      timezone: restaurant.timezone,
      transferNumber: restaurant.transferNumber,
    },
  });

  const watchedValues = watch();

  // Calculate missing fields for readiness checklist
  const missingFields: string[] = [];
  if (!watchedValues.phone) missingFields.push("Phone Number");
  if (!watchedValues.address) missingFields.push("Address");
  if (!watchedValues.timezone) missingFields.push("Timezone");
  if (!watchedValues.transferNumber) missingFields.push("Transfer Number");

  const completedFields = [
    { label: "Phone Number", complete: !!watchedValues.phone },
    { label: "Address", complete: !!watchedValues.address },
    { label: "Timezone", complete: !!watchedValues.timezone },
    { label: "Transfer Number", complete: !!watchedValues.transferNumber },
  ];

  const [hoursChanged, setHoursChanged] = useState(false);

  const updateHour = (
    day: keyof HoursJson,
    field: "open" | "close" | "closed",
    value: string | boolean
  ) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setHoursChanged(true);
  };

  const hasUnsavedChanges = isDirty || hoursChanged;

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      // TODO: replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const updatedRestaurant: Restaurant = {
        ...restaurant,
        ...data,
        hoursJson: hours,
        readiness: {
          isReady: missingFields.length === 0,
          missingFields,
        },
      };
      setRestaurant(updatedRestaurant);
      reset(data);
      setHoursChanged(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">
            Manage your restaurant configuration
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!hasUnsavedChanges || isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {/* Readiness Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {completedFields.map((field) => (
              <div
                key={field.label}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                {field.complete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <span
                  className={
                    field.complete
                      ? "text-foreground"
                      : "text-destructive font-medium"
                  }
                >
                  {field.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...register("phone")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={watchedValues.timezone ?? ""}
                  onValueChange={(v) => setValue("timezone", v, { shouldDirty: true })}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State ZIP"
                {...register("address")}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Operating Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {DAYS.map((day) => (
              <div
                key={day}
                className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center justify-between md:w-32">
                  <span className="font-medium text-foreground">
                    {DAY_LABELS[day]}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!hours[day].closed}
                      onCheckedChange={(checked) =>
                        updateHour(day, "closed", !checked)
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {hours[day].closed ? "Closed" : "Open"}
                    </span>
                  </div>
                  {!hours[day].closed && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours[day].open}
                        onChange={(e) => updateHour(day, "open", e.target.value)}
                        className="w-28"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours[day].close}
                        onChange={(e) =>
                          updateHour(day, "close", e.target.value)
                        }
                        className="w-28"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Call Handling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="transferNumber">Transfer Number</Label>
            <Input
              id="transferNumber"
              type="tel"
              placeholder="(555) 987-6543"
              {...register("transferNumber")}
            />
            <p className="text-sm text-muted-foreground">
              The phone number to transfer calls to when requested by the caller
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unsaved Changes Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card p-4 shadow-lg lg:left-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <p className="text-sm text-muted-foreground">
              You have unsaved changes
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  setHours(restaurant.hoursJson ?? defaultHours);
                  setHoursChanged(false);
                }}
              >
                Discard
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
