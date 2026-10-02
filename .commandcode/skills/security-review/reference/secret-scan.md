# Secret scan recipes (values always masked)

MASK='s/[A-Za-z0-9+\/=_.$-]{12,}/<MASKED>/g'

## Files ever committed
git log --all --format='%h %ad' --date=short --name-status | grep -iE '\.env|secret|cred|\.pem|\.key|id_rsa|service-?account|config\.json'

## Patterns (history) — prints commit + files only
for re in \
  'mongodb(\+srv)?://[^ ]*:[^ ]*@' \
  'AKIA[0-9A-Z]{16}' 'ASIA[0-9A-Z]{16}' \
  '(aws|r2|s3)_?(secret|access)_?(access_)?key' \
  'secretAccessKey|accessKeyId' \
  '(SMTP|EMAIL|MAIL|GMAIL)_?(PASS|PASSWORD|APP_PASSWORD)' \
  'JWT_SECRET|SESSION_SECRET|NEXTAUTH_SECRET' \
  '\$2[aby]\$[0-9]{2}\$' \
  'sk-[A-Za-z0-9]{20,}' 'ghp_[A-Za-z0-9]{30,}' 'github_pat_' 'xox[baprs]-' \
  'AIza[0-9A-Za-z_-]{35}' 're_[A-Za-z0-9]{20,}' \
  '-----BEGIN [A-Z ]*PRIVATE KEY-----' \
  "(password|passwd|pwd|secret|token|api_?key)[\"' ]*[:=][ ]*[\"'][^\"']{6,}" \
  "process\.env\.[A-Z_]+ *\|\| *[\"']" ; do
  echo "== $re"; git log --all -E -G"$re" --format='%h %ad %s' --date=short --name-only | sed -E "$MASK"
done

## Pattern context without values
git log --all -p -E -G'<re>' | grep -nE '<re>' | sed -E "$MASK"

## Tree
git grep -nE '<re>' | sed -E "$MASK"

## Classify each finding
| Name | Type | Service / provider dashboard | Files | Commits (first..last) | In HEAD? | Rotate? |
Anything that ever reached the public repo → rotate. Publicly known defaults (e.g. default admin password + its hash, default JWT string) → treat as compromised; set strong env values.
