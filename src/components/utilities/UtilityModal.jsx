import { Wrench } from 'lucide-react'
import { ModalBackdrop, ModalPanel, ModalHeader, ModalBody } from '../ModalShell.jsx'

export default function UtilityModal({ title, subtitle, onClose, children, wide }) {
  return (
    <ModalBackdrop onClose={onClose} z={120}>
      <ModalPanel
        onClick={(e) => e.stopPropagation()}
        maxWidth={wide ? 'max-w-4xl' : 'max-w-xl'}
      >
        <ModalHeader icon={Wrench} title={title} subtitle={subtitle} onClose={onClose} />
        <ModalBody>{children}</ModalBody>
      </ModalPanel>
    </ModalBackdrop>
  )
}
