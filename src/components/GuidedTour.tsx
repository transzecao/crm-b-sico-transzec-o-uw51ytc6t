import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useCrmStore from '@/stores/useCrmStore'
import { X, HelpCircle, ArrowRight, ArrowLeft, Check } from 'lucide-react'

const getSteps = (role: string) => {
  if (role === 'Acesso Master') {
    return [
      {
        target: 'body',
        title: 'Bem-vindo ao Tour!',
        content: 'Vamos conhecer as principais ferramentas do seu perfil Master.',
      },
      {
        target: '[data-tour="menu-Governança"]',
        title: 'Governança',
        content: 'Gerencie usuários, perfis de acesso e configurações da plataforma.',
      },
      {
        target: '[data-tour="tour-audit"]',
        title: 'Módulo de Auditoria',
        content:
          'Nesta aba você terá acesso ao log detalhado de todas as alterações de campos e movimentações críticas de leads no sistema.',
      },
    ]
  } else if (role.includes('Supervisor')) {
    return [
      {
        target: 'body',
        title: 'Bem-vindo ao Tour!',
        content: 'Conheça as ferramentas para Gestão e Supervisão da sua equipe.',
      },
      {
        target: '[data-tour="menu-Analytics"]',
        title: 'Dashboards e Métricas',
        content: 'Acompanhe as taxas de conversão e a performance de vendas em tempo real.',
      },
      {
        target: '[data-tour="tour-bottleneck"]',
        title: 'Alertas de Gargalos',
        content:
          'Identifique rapidamente quais leads estão parados no funil e tome ações imediatas para destravar o processo.',
      },
    ]
  } else {
    return [
      {
        target: 'body',
        title: 'Bem-vindo ao Tour!',
        content: 'Veja como o CRM pode organizar e acelerar o seu trabalho diário.',
      },
      {
        target: '[data-tour="menu-Prospecção"]',
        title: 'Pipeline de Vendas',
        content: 'Acompanhe e movimente seus leads através do funil de prospecção de forma ágil.',
      },
      {
        target: '[data-tour="menu-Cotação"]',
        title: 'Cotação Rápida',
        content: 'Calcule fretes, cubagem e pedágios utilizando a inteligência do sistema.',
      },
    ]
  }
}

export function GuidedTour() {
  const { state, updateState } = useCrmStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const steps = getSteps(state.role)
  const activeStep = steps[currentStep]

  useEffect(() => {
    if (!state.tourOpen) {
      setCurrentStep(0)
      return
    }

    const updateRect = () => {
      if (activeStep.target === 'body') {
        setRect(null)
        return
      }

      setTimeout(() => {
        const el = document.querySelector(activeStep.target)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(() => setRect(el.getBoundingClientRect()), 300)
        } else {
          setRect(null)
        }
      }, 100)
    }

    updateRect()
    window.addEventListener('resize', updateRect)
    return () => window.removeEventListener('resize', updateRect)
  }, [state.tourOpen, currentStep, state.role, activeStep])

  if (!state.tourOpen) return null

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
    else updateState({ tourOpen: false })
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const handleSkip = () => {
    updateState({ tourOpen: false })
  }

  const isCenter = !rect

  return createPortal(
    <div className="fixed inset-0 z-[100000] pointer-events-none">
      {rect ? (
        <div
          className="absolute border-2 border-primary rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/60 pointer-events-auto" />
      )}

      <div
        className="absolute transition-all duration-300 ease-in-out pointer-events-auto flex items-center justify-center"
        style={
          isCenter
            ? {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100001,
              }
            : {
                top:
                  rect.bottom + 16 > window.innerHeight - 200
                    ? Math.max(16, rect.top - 200)
                    : rect.bottom + 16,
                left: Math.max(
                  16,
                  Math.min(rect.left + rect.width / 2 - 160, window.innerWidth - 340),
                ),
                zIndex: 100001,
              }
        }
      >
        <Card className="w-[320px] shadow-2xl border-primary/20 bg-white animate-in zoom-in-95">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50 rounded-t-lg relative">
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm transition-colors"
              title="Fechar Tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-800">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <HelpCircle className="w-4 h-4 text-primary" />
              </div>
              {activeStep.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-4 text-sm text-slate-600 font-medium leading-relaxed">
            {activeStep.content}
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-slate-100 pt-3 pb-3 bg-slate-50 rounded-b-lg">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStep ? 'bg-primary w-3' : 'bg-slate-300'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-7 text-xs px-2 bg-white"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" /> Voltar
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="h-7 text-xs px-3 bg-primary hover:bg-primary/90 text-white shadow-sm font-bold"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Próximo <ArrowRight className="w-3 h-3 ml-1" />
                  </>
                ) : (
                  <>
                    Concluir <Check className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>,
    document.body,
  )
}
