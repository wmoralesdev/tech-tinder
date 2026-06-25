"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"
import {
  INTENT_OPTIONS,
  PROFILE_LIMITS,
  type IntentValue,
} from "@/lib/profile-constants"
import { formatTechTags, parseTechTags } from "@/lib/parse-tech-tags"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"

type ProfileLinks = {
  github?: string
  website?: string
  x?: string
  linkedin?: string
}

type FormState = {
  handle: string
  displayName: string
  headline: string
  bio: string
  imageUrls: [string, string, string]
  intents: IntentValue[]
  techTagsRaw: string
  location: string
  links: ProfileLinks
  isActive: boolean
}

const EMPTY_FORM: FormState = {
  handle: "",
  displayName: "",
  headline: "",
  bio: "",
  imageUrls: ["", "", ""],
  intents: [],
  techTagsRaw: "",
  location: "",
  links: {},
  isActive: true,
}

function toFormState(profile: Doc<"profiles">): FormState {
  const urls = profile.imageUrls ?? []
  return {
    handle: profile.handle,
    displayName: profile.displayName,
    headline: profile.headline,
    bio: profile.bio,
    imageUrls: [
      urls[0] ?? "",
      urls[1] ?? "",
      urls[2] ?? "",
    ],
    intents: [...profile.intents],
    techTagsRaw: formatTechTags(profile.techTags),
    location: profile.location ?? "",
    links: profile.links ?? {},
    isActive: profile.isActive,
  }
}

export function ProfileForm() {
  const profile = useQuery(api.profiles.getMine)
  const upsertMine = useMutation(api.profiles.upsertMine)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (profile !== undefined && !initialized) {
      setForm(profile ? toFormState(profile) : EMPTY_FORM)
      setInitialized(true)
    }
  }, [profile, initialized])

  const headlineRemaining = PROFILE_LIMITS.headline - form.headline.length
  const bioRemaining = PROFILE_LIMITS.bio - form.bio.length
  const techTagCount = useMemo(
    () => parseTechTags(form.techTagsRaw).length,
    [form.techTagsRaw],
  )

  const toggleIntent = (intent: IntentValue, checked: boolean) => {
    setForm((current) => {
      const next = checked
        ? [...current.intents, intent]
        : current.intents.filter((value) => value !== intent)

      return {
        ...current,
        intents: next.slice(0, PROFILE_LIMITS.intentsMax),
      }
    })
  }

  const updateImageUrl = (index: number, value: string) => {
    setForm((current) => {
      const imageUrls = [...current.imageUrls] as [string, string, string]
      imageUrls[index] = value
      return { ...current, imageUrls }
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      const imageUrls = form.imageUrls
        .map((url) => url.trim())
        .filter(Boolean)
        .slice(0, PROFILE_LIMITS.images)

      await upsertMine({
        handle: form.handle.trim().toLowerCase(),
        displayName: form.displayName.trim(),
        headline: form.headline.trim(),
        bio: form.bio.trim(),
        imageStorageIds: [] as Id<"_storage">[],
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        intents: form.intents,
        techTags: parseTechTags(form.techTagsRaw),
        location: form.location.trim() || undefined,
        links: {
          github: form.links.github?.trim() || undefined,
          website: form.links.website?.trim() || undefined,
          x: form.links.x?.trim() || undefined,
          linkedin: form.links.linkedin?.trim() || undefined,
        },
        isActive: form.isActive,
      })

      toast.success("Profile saved. Ready to ship.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save profile",
      )
    } finally {
      setSaving(false)
    }
  }

  if (profile === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-4">
      <div>
        <h1 className="font-heading text-xl font-semibold">Your dev card</h1>
        <p className="text-sm text-muted-foreground">
          Short README, max three pics. No 200-slide pitch deck.
        </p>
      </div>

      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="handle">Handle</FieldLabel>
            <Input
              id="handle"
              value={form.handle}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  handle: event.target.value,
                }))
              }
              placeholder="merge_queen"
              autoComplete="off"
              required
            />
            <FieldDescription>3–24 chars, lowercase, numbers, _</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="displayName">Display name</FieldLabel>
            <Input
              id="displayName"
              value={form.displayName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  displayName: event.target.value,
                }))
              }
              placeholder="Alex the Architect"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="headline">Headline</FieldLabel>
            <Input
              id="headline"
              value={form.headline}
              maxLength={PROFILE_LIMITS.headline}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  headline: event.target.value,
                }))
              }
              placeholder="Rubber duck wanted for late-night refactors"
              required
            />
            <FieldDescription>{headlineRemaining} left</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Textarea
              id="bio"
              value={form.bio}
              maxLength={PROFILE_LIMITS.bio}
              onChange={(event) =>
                setForm((current) => ({ ...current, bio: event.target.value }))
              }
              placeholder="Shipped 3 side projects and 0 sleep schedules."
              required
            />
            <FieldDescription>{bioRemaining} left</FieldDescription>
          </Field>
        </FieldGroup>

        <FieldGroup>
          <FieldLegend variant="label">Image URLs (max 3)</FieldLegend>
          {form.imageUrls.map((url, index) => (
            <Field key={index}>
              <FieldLabel htmlFor={`image-${index}`}>Photo {index + 1}</FieldLabel>
              <Input
                id={`image-${index}`}
                type="url"
                value={url}
                onChange={(event) => updateImageUrl(index, event.target.value)}
                placeholder="https://..."
              />
            </Field>
          ))}
        </FieldGroup>

        <FieldGroup>
          <FieldLegend variant="label">Looking for</FieldLegend>
          <div className="grid gap-3">
            {INTENT_OPTIONS.map((option) => {
              const checked = form.intents.includes(option.value)
              return (
                <div key={option.value} className="flex items-center gap-3">
                  <Checkbox
                    id={`intent-${option.value}`}
                    checked={checked}
                    onCheckedChange={(checked) =>
                      toggleIntent(option.value, checked)
                    }
                  />
                  <Label htmlFor={`intent-${option.value}`}>{option.label}</Label>
                </div>
              )
            })}
          </div>
          <FieldDescription>Pick 1–4 intents</FieldDescription>
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="techTags">Tech tags</FieldLabel>
          <Input
            id="techTags"
            value={form.techTagsRaw}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                techTagsRaw: event.target.value,
              }))
            }
            placeholder="react, convex, rust, llms"
          />
          <FieldDescription>
            Comma-separated, {techTagCount}/{PROFILE_LIMITS.techTags}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input
            id="location"
            value={form.location}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                location: event.target.value,
              }))
            }
            placeholder="Remote / SF / localhost"
          />
        </Field>

        <FieldGroup>
          <FieldLegend variant="label">Links</FieldLegend>
          {(["github", "website", "x", "linkedin"] as const).map((key) => (
            <Field key={key}>
              <FieldLabel htmlFor={key}>{key}</FieldLabel>
              <Input
                id={key}
                type="url"
                value={form.links[key] ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    links: { ...current.links, [key]: event.target.value },
                  }))
                }
                placeholder={`https://${key === "x" ? "x.com/you" : "..."}`}
              />
            </Field>
          ))}
        </FieldGroup>

        <Field orientation="horizontal">
          <div className="flex flex-1 flex-col gap-1">
            <FieldLabel htmlFor="isActive">Discoverable</FieldLabel>
            <FieldDescription>Show up in the swipe deck</FieldDescription>
          </div>
          <Switch
            id="isActive"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              setForm((current) => ({ ...current, isActive: checked }))
            }
          />
        </Field>
      </FieldSet>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? "Saving..." : profile ? "Update profile" : "Create profile"}
      </Button>
    </form>
  )
}
