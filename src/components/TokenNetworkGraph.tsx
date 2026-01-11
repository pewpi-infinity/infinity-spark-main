import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Token, BuildPage } from '@/types'
import { Network, Sparkle } from '@phosphor-icons/react'

interface TokenNetworkGraphProps {
  tokens: Token[]
  pages: BuildPage[]
  onTokenClick?: (token: Token) => void
  onPageClick?: (page: BuildPage) => void
}

interface Node {
  id: string
  type: 'token' | 'page'
  label: string
  x: number
  y: number
  connections: string[]
  value?: number
}

export function TokenNetworkGraph({ tokens, pages, onTokenClick, onPageClick }: TokenNetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        const height = Math.max(400, Math.min(600, width * 0.75))
        setCanvasSize({ width, height })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const networkNodes: Node[] = []
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    const radius = Math.min(canvasSize.width, canvasSize.height) * 0.35

    tokens.forEach((token, index) => {
      const angle = (index / tokens.length) * 2 * Math.PI
      const associatedPages = pages.filter(p => 
        p.tokenId === token.id || (token.pageIds && token.pageIds.includes(p.id))
      )
      
      const tokenNode: Node = {
        id: token.id,
        type: 'token',
        label: token.query.substring(0, 30),
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        connections: associatedPages.map(p => p.id),
        value: associatedPages.length * 100
      }
      
      networkNodes.push(tokenNode)

      associatedPages.forEach((page, pageIndex) => {
        const pageAngle = angle + ((pageIndex - associatedPages.length / 2) * 0.3)
        const pageRadius = radius * 0.6
        
        networkNodes.push({
          id: page.id,
          type: 'page',
          label: page.title.substring(0, 25),
          x: centerX + Math.cos(pageAngle) * pageRadius,
          y: centerY + Math.sin(pageAngle) * pageRadius,
          connections: [token.id]
        })
      })
    })

    setNodes(networkNodes)
  }, [tokens, pages, canvasSize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    const tokenNodes = nodes.filter(n => n.type === 'token')
    const pageNodes = nodes.filter(n => n.type === 'page')

    ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)'
    ctx.lineWidth = 1

    nodes.forEach(node => {
      node.connections.forEach(connId => {
        const targetNode = nodes.find(n => n.id === connId)
        if (targetNode) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.stroke()
        }
      })
    })

    pageNodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id
      ctx.fillStyle = isSelected ? 'rgba(100, 200, 255, 0.8)' : 'rgba(100, 200, 255, 0.5)'
      ctx.beginPath()
      ctx.arc(node.x, node.y, isSelected ? 7 : 5, 0, 2 * Math.PI)
      ctx.fill()
    })

    tokenNodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id
      const size = isSelected ? 12 : 8 + Math.min((node.value || 0) / 100, 4)
      
      ctx.fillStyle = isSelected ? 'rgba(255, 200, 100, 1)' : 'rgba(255, 200, 100, 0.8)'
      ctx.beginPath()
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    ctx.font = '11px Space Grotesk, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    nodes.forEach(node => {
      if (selectedNode?.id === node.id) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
        ctx.fillText(node.label, node.x, node.y + 15)
      }
    })

  }, [nodes, selectedNode, canvasSize])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (const node of nodes) {
      const size = node.type === 'token' ? 12 : 7
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      
      if (distance <= size) {
        setSelectedNode(node)
        
        if (node.type === 'token' && onTokenClick) {
          const token = tokens.find(t => t.id === node.id)
          if (token) onTokenClick(token)
        } else if (node.type === 'page' && onPageClick) {
          const page = pages.find(p => p.id === node.id)
          if (page) onPageClick(page)
        }
        return
      }
    }
    
    setSelectedNode(null)
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network size={24} className="text-accent" weight="bold" />
          Token Network
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Visual map of your tokens and their connected pages
        </p>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            className="w-full h-auto cursor-pointer border border-border/50 rounded-lg bg-card/30"
            style={{ maxHeight: '600px' }}
          />
        </div>
        
        <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgba(255,200,100,0.8)]"></div>
            <span className="text-muted-foreground">Tokens (size = value)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgba(100,200,255,0.5)]"></div>
            <span className="text-muted-foreground">Pages</span>
          </div>
        </div>

        {selectedNode && (
          <div className="mt-4 p-4 bg-primary/10 border border-accent/30 rounded-lg">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="mb-2">
                  {selectedNode.type === 'token' ? 'Token' : 'Page'}
                </Badge>
                <h4 className="font-semibold truncate">{selectedNode.label}</h4>
                {selectedNode.type === 'token' && selectedNode.value && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Value: {selectedNode.value} points
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (selectedNode.type === 'token' && onTokenClick) {
                    const token = tokens.find(t => t.id === selectedNode.id)
                    if (token) onTokenClick(token)
                  } else if (selectedNode.type === 'page' && onPageClick) {
                    const page = pages.find(p => p.id === selectedNode.id)
                    if (page) onPageClick(page)
                  }
                }}
                className="flex-shrink-0"
              >
                View Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
