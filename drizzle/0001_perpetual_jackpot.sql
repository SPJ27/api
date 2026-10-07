CREATE TABLE "allowed_github_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"github_id" text NOT NULL,
	"github_username" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "allowed_github_accounts_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "apiKeys" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"title" text,
	"created_by" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	"revoked_at" timestamp,
	CONSTRAINT "apiKeys_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "apiKeys" ADD CONSTRAINT "apiKeys_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "apiKeys_createdBy_idx" ON "apiKeys" USING btree ("created_by");