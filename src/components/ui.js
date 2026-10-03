import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from 'discord.js';
export const v2 = (components, ephemeral = false) => ({ components, flags: MessageFlags.IsComponentsV2 | (ephemeral ? MessageFlags.Ephemeral : 0) });
export function panel(title, body, buttons = []) {
  const container = new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${title}\n${body}`));
  if (buttons.length) container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)).addActionRowComponents(new ActionRowBuilder().addComponents(buttons));
  return container;
}
export const button = (id, label, style = ButtonStyle.Secondary, disabled = false) => new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(style).setDisabled(disabled);
