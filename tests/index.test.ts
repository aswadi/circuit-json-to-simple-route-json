import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getSimpleRouteJsonFromCircuitJson } from "lib/index"

test("package entrypoint can be imported", async () => {
  await expect(import("lib/index")).resolves.toBeDefined()
})

test("converts direct source traces into simple route connections", () => {
  const circuitJson = [
    {
      type: "pcb_board",
      pcb_board_id: "pcb_board_1",
      center: { x: 0, y: 0 },
      width: 10,
      height: 8,
      num_layers: 2,
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
      min_trace_thickness: 0.2,
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
    },
    {
      type: "pcb_port",
      pcb_port_id: "pcb_port_1",
      source_port_id: "source_port_1",
      x: -1,
      y: 0,
      layers: ["top"],
    },
    {
      type: "pcb_port",
      pcb_port_id: "pcb_port_2",
      source_port_id: "source_port_2",
      x: 1,
      y: 0,
      layers: ["bottom"],
    },
  ] as AnyCircuitElement[]

  const { simpleRouteJson } = getSimpleRouteJsonFromCircuitJson({ circuitJson })

  expect(simpleRouteJson.bounds).toEqual({
    minX: -5,
    maxX: 5,
    minY: -4,
    maxY: 4,
  })
  expect(simpleRouteJson.layerCount).toBe(2)
  expect(simpleRouteJson.connections).toEqual([
    {
      name: "source_trace_1",
      source_trace_id: "source_trace_1",
      nominalTraceWidth: 0.2,
      width: 0.2,
      pointsToConnect: [
        {
          x: -1,
          y: 0,
          layer: "top",
          pointId: "pcb_port_1",
          pcb_port_id: "pcb_port_1",
        },
        {
          x: 1,
          y: 0,
          layer: "bottom",
          pointId: "pcb_port_2",
          pcb_port_id: "pcb_port_2",
        },
      ],
    },
  ])
})
