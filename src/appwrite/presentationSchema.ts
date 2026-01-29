import Ajv, { type JSONSchemaType } from "ajv";
import type {
  Position,
  Size,
  Color,
  Picture,
  Gradient,
  Background,
  FontStyle,
  TextElement,
  ImageElement,
  SlideElement,
  Slide,
} from "../types/presentationTypes";

export type PresentationDTO = {
  title: string;
  slides: Slide[];
};

const positionSchema: JSONSchemaType<Position> = {
  type: "object",
  required: ["x", "y"],
  properties: {
    x: { type: "number" },
    y: { type: "number" }
  }
};

const sizeSchema: JSONSchemaType<Size> = {
  type: "object",
  required: ["width", "height"],
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 }
  }
};

const colorSchema: JSONSchemaType<Color> = {
  type: "object",
  required: ["type", "color"],
  properties: {
    type: { type: "string", const: "color" },
    color: { type: "string" }
  }
};

const pictureSchema: JSONSchemaType<Picture> = {
  type: "object",
  required: ["type", "src"],
  properties: {
    type: { type: "string", const: "picture" },
    src: { type: "string" }
  }
};

const gradientSchema: JSONSchemaType<Gradient> = {
  type: "object",
  required: ["type", "colors"],
  properties: {
    type: { type: "string", const: "gradient" },
    colors: {
      type: "array",
      items: colorSchema
    }
  }
};

const backgroundSchema: JSONSchemaType<Background> = {
  oneOf: [colorSchema, pictureSchema, gradientSchema]
};

const fontStyleSchema: JSONSchemaType<FontStyle> = {
  type: "object",
  required: ["fontFamily", "fontSize", "fontWeight", "fontStyle", "color"],
  properties: {
    fontFamily: { type: "string" },
    fontSize: { type: "number", minimum: 1 },
    fontWeight: { type: "string" },
    fontStyle: { type: "string" },
    color: colorSchema
  }
};

const textElementSchema: JSONSchemaType<TextElement> = {
  type: "object",
  required: ["id", "type", "content", "position", "sizes", "style"],
  properties: {
    id: { type: "string" },
    type: { type: "string", const: "text" },
    content: {
      type: "string"
    },
    position: positionSchema,
    sizes: sizeSchema,
    style: fontStyleSchema
  }
};

const imageElementSchema: JSONSchemaType<ImageElement> = {
  type: "object",
  required: ["id", "type", "src", "position", "sizes"],
  properties: {
    id: { type: "string" },
    type: { type: "string", const: "image" },
    src: { type: "string" },
    position: positionSchema,
    sizes: sizeSchema
  }
};

const slideElementSchema: JSONSchemaType<SlideElement> = {
  oneOf: [textElementSchema, imageElementSchema]
};

const slideSchema: JSONSchemaType<Slide> = {
  type: "object",
  required: ["id", "elements", "background"],
  properties: {
    id: { type: "string" },
    elements: {
      type: "array",
      items: slideElementSchema
    },
    background: backgroundSchema
  }
};

const presentationSchema: JSONSchemaType<PresentationDTO> = {
  type: "object",
  additionalProperties: false,
  required: ["title", "slides"],
  properties: {
    title: {
      type: "string",
      minLength: 1,
    },
    slides: {
      type: "array",
      items: slideSchema
    },
  }
};

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  strict: true,
  verbose: true
});

const validate = ajv.compile(presentationSchema);

export function validatePresentation(data: unknown): {
  ok: boolean;
  errors: string[];
} {
  const isValid = validate(data);

  if (isValid) {
    return { ok: true, errors: [] };
  }

  const errors = validate.errors?.map(error => {
    const path = error.instancePath || "root";
    const message = error.message || "невалидные данные";
    const params = error.params ? ` (${JSON.stringify(error.params)})` : '';
    return `${path}: ${message}${params}`;
  }) ?? [];

  return { ok: false, errors };
}

export function isPresentationDTO(data: unknown): data is PresentationDTO {
  return validate(data);
}

export function parsePresentation(json: string): PresentationDTO {
  let data: unknown;

  try {
    data = JSON.parse(json);
  } catch {
    throw new Error("Невалидный JSON формат");
  }

  const result = validatePresentation(data);
  if (!result.ok) {
    throw new Error(`Невалидная презентация: ${result.errors.join(", ")}`);
  }

  return data as PresentationDTO;
}


export function validatePresentationDetailed(data: unknown): {
  isValid: boolean;
  errors: Array<{
    path: string;
    message: string;
    params?: Record<string, unknown>;
  }>;
  validatedData?: PresentationDTO;
} {
  const isValid = validate(data);

  if (isValid) {
    return {
      isValid: true,
      errors: [],
      validatedData: data as PresentationDTO
    };
  }

  const errors = validate.errors?.map(error => ({
    path: error.instancePath || "/",
    message: error.message || "Ошибка валидации",
    params: error.params
  })) ?? [];

  return { isValid: false, errors };
}