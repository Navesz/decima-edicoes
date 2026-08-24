import projectData from './project-data.json';

const numberWords = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'] as const;
const commercialStatusLabels: Record<string, string> = { prototyping: 'Em prototipagem' };
const pad2 = (value: number) => String(value).padStart(2, '0');
const wordFor = (value: number) => numberWords[value] ?? String(value);
const capitalize = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export const project = projectData;
export const collection = project.collection;
export const product = project.product;
export const documents = project.documents;
export const proofBodies = project.proofBodies;
export const prototypeGate = project.prototypeGate;

export const edition = {
  ...project.edition,
  collectionNumber: pad2(collection.number),
  firstPiece: pad2(1),
  lastPiece: pad2(project.edition.runSize),
  middlePieces: `${pad2(2)}—${pad2(project.edition.runSize - 1)}`,
  prototypeNumber: pad2(project.prototype.number),
  prototypeCode: project.prototype.internalCode,
  currentStage: `${pad2(project.edition.producedPieces)}/${project.edition.runSize}`,
  firstPieceFraction: `${pad2(1)}/${project.edition.runSize}`,
  lastPieceFraction: `${pad2(project.edition.runSize)}/${project.edition.runSize}`,
  runSizeWord: wordFor(project.edition.runSize),
  producedPiecesWord: wordFor(project.edition.producedPieces),
  artworksLabel: pad2(project.edition.artworks),
  reprintsLabel: pad2(project.edition.reprints),
  commercialStatusLabel: commercialStatusLabels[project.edition.commercialStatus] ?? project.edition.commercialStatus,
} as const;

export const productLabels = {
  diameter: `${product.diameterCm} cm`,
  height: `${product.heightCm} cm`,
  topThickness: `${product.topThicknessMm.minimum}–${product.topThicknessMm.maximum} mm`,
  proofPlate: `${product.proofPlateCm} × ${product.proofPlateCm} cm`,
} as const;

export const projectLabels = {
  proofBodiesWord: wordFor(proofBodies.length),
  proofBodiesHeading: capitalize(wordFor(proofBodies.length)),
  gateItemsWord: wordFor(prototypeGate.length),
  gateItemsHeading: capitalize(wordFor(prototypeGate.length)),
} as const;

const decisionTokens: Record<string, string | number> = {
  runSize: edition.runSize,
  lastPieceFraction: edition.lastPieceFraction,
  prototypeNumber: edition.prototypeNumber,
  firstPiece: edition.firstPiece,
  gateItemsWord: projectLabels.gateItemsWord,
};

function resolveDecisionText(value: string) {
  return value.replace(/\{(\w+)\}/g, (token, key: string) => key in decisionTokens ? String(decisionTokens[key]) : token);
}

export const decisionLog = project.decisionLog.map((item) => ({
  ...item,
  decision: resolveDecisionText(item.decision),
  record: resolveDecisionText(item.record),
}));
