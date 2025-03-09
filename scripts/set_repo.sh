#!/bin/bash

#MARK: Functions
#region Functions

cross_compatible_run() {
  local script_name="$1"
  shift
  local package_manager

  package_manager=$(grep -o '"packageManager": *"[^"]*"' package.json | awk -F '"' '{print $4}')

  if [[ "$package_manager" == npm* ]]; then
        npm run "$script_name" -- "$@"
    elif [[ "$package_manager" == yarn* ]]; then
        yarn run "$script_name" "$@"
    elif [[ "$package_manager" == pnpm* ]]; then
        pnpm run "$script_name" "$@"
    else
        npm run "$script_name" -- "$@"
    fi
}

#endregion

#MARK: Replacement for package.json
#region Replacement for package.json
echo "Set the name in your project to use in \"package.json\" name:"
read PACKAGE_JSON_NAME
#endregion

#MARK: Replacement for postgres schema
#region Replacement for postgres schema
echo "Set the name of the Postgres schema to use in your database (defaults to 'public'):"
read POSTGRES_SCHEMA
POSTGRES_SCHEMA=${POSTGRES_SCHEMA:-public}
#endregion

#MARK: Replacement for HTML Title
#region Replacement for HTML Title
echo "Set the text you want to display as HTML title:"
read HTML_TITLE
#endregion

#MARK: .env Creation
#region .env Creation
echo "Set the Database Connection String to use in your database (No characters displayed):"
read -s DATABASE_URL
BETTER_AUTH_SECRET=$(openssl rand -base64 32)

if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

cat > .env <<EOL
DATABASE_URL="$DATABASE_URL"
BETTER_AUTH_URL="http://localhost:3000/"
BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET"
EOL

#endregion

#Mark: Auth schema generation
#region Auth schema generation
echo "Do you want to generate the auth schema? (Y/n)"
read GENERATE_AUTH
GENERATE_AUTH=$(echo "$GENERATE_AUTH" | tr '[:upper:]' '[:lower:]')

# Default to "y" unless explicitly "n"
if [ -z "$GENERATE_AUTH" ] || [ "$GENERATE_AUTH" != "n" ]; then
  GENERATE_AUTH="y"
fi

if [ "$GENERATE_AUTH" = "y" ]; then
  echo "Generating auth schema..."
  cross_compatible_run auth:generate -y
fi
#endregion

# Mark: Run generations
#region Run generations
npx --yes @getgrit/cli apply "set_repo(packageJson=\"package.json\", newPackageJsonName=\"$PACKAGE_JSON_NAME\", pgSchemaLocation=\"db/schema.ts\", pgNewSchemaName=\"$POSTGRES_SCHEMA\", rootRouteLocation=\"app/routes/__root.tsx\", newRootRouteHtmlName=\"$HTML_TITLE\", dbIndexLocation=\"db/index.ts\", authServerLocation=\"app/lib/auth.server.ts\", generateSchemaAnswer=\"$GENERATE_AUTH\")" "**/*.(json|ts|tsx)" --force
#endregion

#MARK: Finish
#region Finish
clear
echo "################################################################################"
echo "#   All set. You should run: \"pnpm dz generate --name=InitialMigration\"        #"
echo "#    to generate the migrations to the database, and then, once completed      #"
echo "#    run: \"pnpm db:migrate\" to apply the migrations to the database.           #"
echo "################################################################################"
