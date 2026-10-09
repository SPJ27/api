"use client";
import React, { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { generateApiKey } from "@/actions/apiKey";
import { MdLogout, MdAdd, MdContentCopy, MdCheck, MdClose } from "react-icons/md";
import { FiKey } from "react-icons/fi";
import LoginPage from "@/components/LoginPage";

type ApiKeyItem = {
  id: string;
  name?: string | null;
  start?: string | null;
  prefix?: string | null;
  expiresAt?: string | Date | null;
  createdAt?: string | Date | null;
};

const EXPIRY_PRESETS = [
  { label: "1 day", days: 1 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
];

const formatDate = (d?: string | Date | null) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const getExpiryStatus = (expiresAt?: string | Date | null) => {
  if (!expiresAt) {
    return { label: "Never expires", className: "bg-neutral-100 text-neutral-600" };
  }
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  if (msLeft <= 0) {
    return { label: "Expired", className: "bg-red-50 text-red-600" };
  }
  if (daysLeft <= 7) {
    return {
      label: `Expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
      className: "bg-amber-50 text-amber-700",
    };
  }
  return { label: `Expires in ${daysLeft} days`, className: "bg-emerald-50 text-emerald-700" };
};


type CreateKeyDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, expiresInDays: number) => Promise<void>;
};

const CreateKeyDialog = ({ open, onClose, onCreate }: CreateKeyDialogProps) => {
  const [name, setName] = useState("");
  const [days, setDays] = useState<number>(30);
  const [custom, setCustom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setDays(30);
      setCustom("");
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting, onClose]);

  if (!open) return null;

  const customDays = custom ? parseInt(custom, 10) : null;
  const effectiveDays = customDays ?? days;
  const valid = name.trim().length > 0 && Number.isFinite(effectiveDays) && effectiveDays > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    await onCreate(name.trim(), effectiveDays);
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onMouseDown={(e) => e.target === e.currentTarget && !submitting && onClose()}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-key-title"
        className="w-full max-w-md rounded-sm bg-white shadow-xl border border-neutral-200 p-6 flex flex-col gap-5"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="create-key-title" className="text-xl font-light text-neutral-900">
              Create API key
            </h2>
            <p className="text-sm font-extralight text-neutral-500 mt-0.5">
              Give your key a name and choose when it should expire.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="key-name" className="text-sm font-light text-neutral-900">
            Key name
          </label>
          <input
            id="key-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="e.g. Production server"
            className="border border-neutral-300 rounded-sm px-3 py-1 text-sm outline-none "
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-700">Expires in</span>
          <div className="flex flex-wrap gap-2">
            {EXPIRY_PRESETS.map((p) => {
              const active = !custom && days === p.days;
              return (
                <button
                  type="button"
                  key={p.days}
                  onClick={() => {
                    setDays(p.days);
                    setCustom("");
                  }}
                  className={`px-3 py-1 text-sm rounded-sm border transition cursor-pointer ${
                    active
                      ? "bg-neutral-800 text-white border-neutral-800"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>or custom</span>
            <input
              type="number"
              min={1}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="30"
              className="w-20 border border-neutral-300 rounded-md px-2 py-1 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition"
            />
            <span>days</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-1.5 text-sm rounded-sm text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid || submitting}
            className="px-4 py-1.5 text-sm rounded-sm bg-neutral-800 text-white hover:bg-neutral-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Creating..." : "Create key"}
          </button>
        </div>
      </form>
    </div>
  );
};


const Page = () => {
  const { data: session, isPending } = authClient.useSession();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadKeys = useCallback(async () => {
    setKeysLoading(true);
    const { data, error } = await authClient.apiKey.list();
    if (error) {
      setError(error.message ?? "Failed to load API keys");
    } else {
      const list = Array.isArray(data) ? data : (data as any)?.apiKeys ?? [];
      setApiKeys(list);
    }
    setKeysLoading(false);
  }, []);

  useEffect(() => {
    if (session) loadKeys();
  }, [session, loadKeys]);

  const handleCreate = async (name: string, expiresInDays: number) => {
    setError(null);
    setCopied(false);
    const res = await generateApiKey(name, expiresInDays);
    if ("error" in res && res.error) {
      setError(res.error);
      return;
    }
    setNewKey((res as any).key);
    setDialogOpen(false);
    await loadKeys();
  };

  const copyKey = async () => {
    if (!newKey) return;
    try {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard");
    }
  };

  if (isPending) return "Loading...";
  if (!session) return <LoginPage />;

  return (
    <div className="w-full min-h-screen flex py-10 px-6 md:px-20 flex-col gap-1">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-neutral-900">
          Hello, {session.user.name.split(" ")[0]}!
        </h1>
        <button
          className="bg-red-500 text-white px-5 cursor-pointer hover:bg-red-600 transition-colors duration-200 text-sm rounded-xs py-1 flex gap-2 items-center"
          onClick={async () => await authClient.signOut()}
        >
          Sign Out <MdLogout />
        </button>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-light text-neutral-900">API keys</h2>
          <p className="text-sm font-light text-neutral-500 tracking-wide">
            Manage your API keys
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1.5 bg-neutral-900 text-white text-sm px-4 py-2 rounded-md hover:bg-neutral-700 transition cursor-pointer"
        >
          <MdAdd size={18} /> Generate API key
        </button>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {newKey && (
        <div className="mt-4 rounded-sm border border-emerald-100 bg-emerald-50 p-4 flex flex-col gap-2">
          <p className="text-sm text-emerald-900">
            Your new key is ready. Copy it now, it won&apos;t be shown again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 break-all bg-white  border-emerald-200 rounded px-3 py-2 text-sm text-neutral-800">
              {newKey}
            </code>
            <button
              onClick={copyKey}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
            >
              {copied ? <MdCheck size={16} /> : <MdContentCopy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => setNewKey(null)}
              className="p-2 text-emerald-700 hover:text-emerald-900 cursor-pointer"
              aria-label="Dismiss"
            >
              <MdClose size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {keysLoading && (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[72px] rounded-lg bg-neutral-100 animate-pulse" />
            ))}
          </>
        )}

        {!keysLoading && apiKeys.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-neutral-300 rounded-lg py-14 text-center">
            <div className="p-3 rounded-full bg-neutral-100 text-neutral-500">
              <FiKey size={22} />
            </div>
            <p className="text-sm font-medium text-neutral-800">No API keys yet</p>
            <p className="text-sm text-neutral-500">
              Create your first key to start using the API.
            </p>
          </div>
        )}

        {!keysLoading &&
          apiKeys.map((k) => {
            const status = getExpiryStatus(k.expiresAt);
            const expired = !!k.expiresAt && new Date(k.expiresAt).getTime() <= Date.now();
            return (
              <div
                key={k.id}
                className={`flex items-center gap-4 rounded-xs border border-neutral-200 bg-white px-4 py-3 transition ${
                  expired ? "opacity-60" : ""
                }`}
              >
                <div className="p-2.5 rounded-md bg-neutral-50 text-neutral-600">
                  <FiKey size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-700">
                    {k.name ?? "Unnamed"}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                    {k.start ?? k.prefix ?? ""}••••••••
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end text-xs text-neutral-500">
                  <span>Created</span>
                  <span className="text-neutral-700">{formatDate(k.createdAt)}</span>
                </div>

                <div className="hidden sm:flex flex-col items-end text-xs text-neutral-500">
                  <span>Expires</span>
                  <span className="text-neutral-700">
                    {k.expiresAt ? formatDate(k.expiresAt) : "Never"}
                  </span>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
      </div>

      <CreateKeyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default Page;