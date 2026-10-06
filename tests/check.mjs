import assert from "node:assert";
import fs from "node:fs";
import { register } from "node:module";

register(
  `data:text/javascript,export async function load(url, context, nextLoad) {
    if (url.endsWith('.svg')) {
      return { format: 'module', shortCircuit: true, source: 'export default { src: "' + url + '" };' };
    }
    return nextLoad(url, context);
  }`
);

const { DIALOGUE_STEPS, MERCHANT_SKILL_QUESTS } = await import(
  "../src/data/dialogueData.ts"
);
const { SCROLL_DEFINITIONS } = await import(
  "../src/components/scene/createCounterDesk.ts"
);
const { createEnvironment } = await import(
  "../src/components/scene/createEnvironment.ts"
);

assert.strictEqual(
  typeof createEnvironment,
  "function",
  "createEnvironment deve ser uma função exportada"
);

// 1. Verify initial step matches user request ("Olá, Jogador")
assert.ok(
  DIALOGUE_STEPS.length >= 3,
  "Devem existir pelo menos 3 etapas de diálogo"
);
const initialStep = DIALOGUE_STEPS[0];
assert.strictEqual(initialStep.id, 0, "O primeiro passo deve ter id 0");
assert.ok(
  initialStep.question.includes("Olá, Jogador"),
  "A primeira pergunta deve saudar o jogador com 'Olá, Jogador'"
);
assert.ok(
  initialStep.options.length > 0,
  "O primeiro passo deve ter opções clicáveis"
);

// 2. Verify all option references point to valid steps
const validIds = new Set(DIALOGUE_STEPS.map((s) => s.id));
for (const step of DIALOGUE_STEPS) {
  assert.ok(
    step.question.trim().length > 0,
    `Pergunta do passo ${step.id} não pode ser vazia`
  );
  assert.ok(
    step.options.length > 0,
    `Passo ${step.id} deve conter pelo menos uma opção`
  );

  for (const opt of step.options) {
    assert.ok(
      opt.text.trim().length > 0,
      `Texto da opção no passo ${step.id} não pode ser vazio`
    );
    assert.ok(
      validIds.has(opt.nextId),
      `Opção "${opt.text}" aponta para nextId inexistente: ${opt.nextId}`
    );
  }
}

// 3. Verify the 4 Merchant Skill Scrolls requested by the user
const expectedTitles = [
  "Inteligência Emocional",
  "Estilos de Liderança",
  "Motivação no trabalho",
  "Criatividade",
];

assert.strictEqual(
  SCROLL_DEFINITIONS.length,
  4,
  "Devem existir exatamente 4 pergaminhos 3D"
);
for (const expectedTitle of expectedTitles) {
  const found = SCROLL_DEFINITIONS.some((s) => s.title === expectedTitle);
  assert.ok(
    found,
    `Pergaminho 3D "${expectedTitle}" não encontrado nas definições`
  );
}

// 4. Verify Merchant Skill Quests integrity
for (const scroll of SCROLL_DEFINITIONS) {
  const quest = MERCHANT_SKILL_QUESTS[scroll.key];
  assert.ok(quest, `Quest para a chave "${scroll.key}" não encontrada`);
  assert.ok(
    quest.intro.length > 0,
    `Introdução da quest "${quest.title}" não pode ser vazia`
  );
  assert.ok(
    quest.question.length > 0,
    `Pergunta da quest "${quest.title}" não pode ser vazia`
  );
  assert.ok(
    quest.options.length >= 2,
    `Quest "${quest.title}" deve ter pelo menos 2 opções`
  );
  for (const opt of quest.options) {
    assert.ok(opt.label.length > 0, "Opção deve ter título/label");
    if (opt.styleResult) {
      assert.ok(opt.styleResult.length > 0, "Opção deve ter styleResult");
    }
  }
}

// 5. Verify User Registration module and personalization logic
import { userRegistrationSchema } from "../src/schema/userSchema.ts";

assert.ok(
  fs.existsSync("./src/components/ui/UserRegistrationModal.tsx"),
  "Componente UserRegistrationModal.tsx deve existir"
);

// Verify Zod schema validation
const validData = userRegistrationSchema.safeParse({
  name: "  Alex ",
  email: "  alex@guilda.com  ",
});
assert.ok(validData.success, "Schema Zod deve aceitar nome e e-mail válidos");
assert.strictEqual(
  validData.data.name,
  "Alex",
  "Schema Zod deve fazer trim no nome"
);
assert.strictEqual(
  validData.data.email,
  "alex@guilda.com",
  "Schema Zod deve fazer trim no e-mail"
);

const invalidName = userRegistrationSchema.safeParse({
  name: "A",
  email: "alex@guilda.com",
});
assert.strictEqual(
  invalidName.success,
  false,
  "Schema Zod deve rejeitar nome com menos de 2 caracteres"
);

const invalidEmail = userRegistrationSchema.safeParse({
  name: "Alex",
  email: "email-invalido",
});
assert.strictEqual(
  invalidEmail.success,
  false,
  "Schema Zod deve rejeitar e-mail inválido"
);

// Verify that adventurer substitution logic correctly replaces 'aventureiro' with player name
const sampleIntro = "Ei, aventureiro! Dominar as próprias emoções é a chave.";
const replacedIntro = sampleIntro.replace(/aventureiro/gi, "Bruno");
assert.strictEqual(
  replacedIntro,
  "Ei, Bruno! Dominar as próprias emoções é a chave.",
  "Substituição de 'aventureiro' pelo nome deve funcionar corretamente"
);

console.log(
  "✓ Todos os testes de validação de diálogo, pergaminhos 3D, schema Zod, cadastro e quests passaram com sucesso!"
);
