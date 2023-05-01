
import { createPiece, PieceType } from "@activepieces/pieces-framework";
import packageJson from "../package.json";
import { createOrUpdateContact } from "./lib/actions/create-or-update-contact";

export const constantContact = createPiece({
  name: "constant-contact",
  displayName: "Constant Contact",
  logoUrl: "https://cdn.activepieces.com/pieces/constant-contact.png",
  version: packageJson.version,
  type: PieceType.PUBLIC,
  authors: ["abuaboud"],
  actions: [createOrUpdateContact],
  triggers: [],
});
