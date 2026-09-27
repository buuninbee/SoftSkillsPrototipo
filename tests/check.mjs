import assert from "node:assert";
import { DIALOGUE_STEPS, MERCHANT_SKILL_QUESTS } from "../src/data/dialogueData.ts";
import { SCROLL_DEFINITIONS } from "../src/components/scene/createCounterDesk.ts";
import { createEnvironment } from "../src/components/scene/createEnvironment.ts";

assert.strictEqual(typeof createEnvironment, "function", "createEnvironment deve ser uma função exportada");

// 1. Verify initial step matches user request ("Olá, Jogador")
assert.ok(DIALOGUE_STEPS.length >= 3, "Devem existir pelo menos 3 etapas de diálogo");
const initialStep = DIALOGUE_STEPS[0];
assert.strictEqual(initialStep.id, 0, "O primeiro passo deve ter id 0");
assert.ok(
  initialStep.question.includes("Olá, Jogador"),
  "A primeira pergunta deve saudar o jogador com 'Olá, Jogador'"
);
assert.ok(initialStep.options.length > 0, "O primeiro passo deve ter opções clicáveis");

// 2. Verify all option references point to valid steps
const validIds = new Set(DIALOGUE_STEPS.map((s) => s.id));
for (const step of DIALOGUE_STEPS) {
  assert.ok(step.question.trim().length > 0, `Pergunta do passo ${step.id} não pode ser vazia`);
  assert.ok(step.options.length > 0, `Passo ${step.id} deve conter pelo menos uma opção`);

  for (const opt of step.options) {
    assert.ok(opt.text.trim().length > 0, `Texto da opção no passo ${step.id} não pode ser vazio`);
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

assert.strictEqual(SCROLL_DEFINITIONS.length, 4, "Devem existir exatamente 4 pergaminhos 3D");
for (const expectedTitle of expectedTitles) {
  const found = SCROLL_DEFINITIONS.some((s) => s.title === expectedTitle);
  assert.ok(found, `Pergaminho 3D "${expectedTitle}" não encontrado nas definições`);
}

// 4. Verify Merchant Skill Quests integrity
for (const scroll of SCROLL_DEFINITIONS) {
  const quest = MERCHANT_SKILL_QUESTS[scroll.key];
  assert.ok(quest, `Quest para a chave "${scroll.key}" não encontrada`);
  assert.ok(quest.intro.length > 0, `Introdução da quest "${quest.title}" não pode ser vazia`);
  assert.ok(quest.question.length > 0, `Pergunta da quest "${quest.title}" não pode ser vazia`);
  assert.ok(quest.options.length >= 2, `Quest "${quest.title}" deve ter pelo menos 2 opções`);
  for (const opt of quest.options) {
    assert.ok(opt.label.length > 0, "Opção deve ter título/label");
    assert.ok(opt.styleResult.length > 0, "Opção deve ter styleResult");
    assert.ok(opt.xp > 0, "Opção deve conceder XP positivo");
  }
}

console.log("✓ Todos os testes de validação de diálogo, pergaminhos 3D e quests passaram com sucesso!");
