interface TextPromptProps {
  text: () => string;
  setText: (value: string) => void;
  textareaRef: (el: HTMLTextAreaElement) => void;
  adjustHeight: () => void;
}

export default function TextPrompt(props: TextPromptProps) {
  return (
    <div class="relative">
      <textarea
        ref={props.textareaRef}
        value={props.text()}
        onInput={(e) => {
          props.setText(e.currentTarget.value);
          props.adjustHeight();
        }}
        placeholder="Comment or instruction before action..."
        rows={3}
        class="w-full min-h-[96px] rounded-xl bg-elevated text-primary p-3 text-sm resize-none border border-divider placeholder:text-muted-2 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
      />
      <div class="absolute bottom-2 right-3 text-xs text-muted">
        {props.text().length}
      </div>
    </div>
  );
}
