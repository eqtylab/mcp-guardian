import { useState } from "react";
import { Button } from "./ui/button";
import {
  CyberDialog,
  CyberDialogContent,
  CyberDialogHeader,
  CyberDialogTitle,
  CyberDialogClose,
  CyberDialogBody,
  CyberDialogFooter,
} from "./ui/cyber-dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FormField, FormLabel } from "./ui/form-field";

const CyberDialogExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAngularOpen, setIsAngularOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-center text-muted-foreground mb-2">Click the buttons below to preview our cyberpunk dialog variants:</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          variant="cyber" 
          glow="hover" 
          className="py-3 flex-1 cyber-btn-enhanced" 
          onClick={() => setIsOpen(true)}
        >
          <span className="relative z-10">Open Cyber Dialog</span>
        </Button>
        
        <Button 
          variant="cyber" 
          glow="hover"
          className="py-3 flex-1 cyber-btn-enhanced bg-gradient-to-r from-[rgba(var(--neon-cyan-rgb),0.2)] to-[rgba(var(--neon-cyan-rgb),0.05)]" 
          onClick={() => setIsAngularOpen(true)}
        >
          <span className="relative z-10">Open Angular Dialog</span>
        </Button>
      </div>
      
      {/* Regular Cyber Dialog */}
      <CyberDialog open={isOpen} onOpenChange={setIsOpen}>
        <CyberDialogContent variant="cyber" glow="subtle">
          <CyberDialogHeader variant="cyber" glow="subtle">
            <CyberDialogTitle glow="subtle">Cyberpunk Dialog</CyberDialogTitle>
            <CyberDialogClose variant="cyber" />
          </CyberDialogHeader>
          <CyberDialogBody variant="cyber">
            <div className="space-y-4">
              <p>This is a cyberpunk-styled dialog with a subtle glow effect.</p>
              
              <FormField>
                <FormLabel>Input Field</FormLabel>
                <Input variant="cyber" glow="focus" placeholder="Enter text..." />
              </FormField>
              
              <FormField>
                <FormLabel>Text Area</FormLabel>
                <Textarea variant="cyber" glow="focus" placeholder="Enter longer text..." />
              </FormField>
            </div>
          </CyberDialogBody>
          <CyberDialogFooter variant="cyber" glow="subtle">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Confirm</Button>
          </CyberDialogFooter>
        </CyberDialogContent>
      </CyberDialog>
      
      {/* Angular Cyber Dialog */}
      <CyberDialog open={isAngularOpen} onOpenChange={setIsAngularOpen}>
        <CyberDialogContent variant="angular" glow="subtle">
          <CyberDialogHeader variant="cyber" glow="subtle">
            <CyberDialogTitle glow="subtle">Angular Cyberpunk Dialog</CyberDialogTitle>
            <CyberDialogClose variant="cyber" />
          </CyberDialogHeader>
          <CyberDialogBody variant="cyber">
            <div className="space-y-4">
              <p>This is an angular cyberpunk-styled dialog with masked corners.</p>
              
              <FormField>
                <FormLabel>Input Field</FormLabel>
                <Input variant="angular" glow="focus" placeholder="Enter text..." />
              </FormField>
              
              <FormField>
                <FormLabel>Text Area</FormLabel>
                <Textarea variant="angular" glow="focus" placeholder="Enter longer text..." />
              </FormField>
            </div>
          </CyberDialogBody>
          <CyberDialogFooter variant="cyber" glow="subtle">
            <Button variant="secondary" onClick={() => setIsAngularOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">Confirm</Button>
          </CyberDialogFooter>
        </CyberDialogContent>
      </CyberDialog>
    </div>
  );
};

export default CyberDialogExample;