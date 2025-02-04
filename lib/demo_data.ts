export const test_data = [
  {
    id: "server1",
    name: "Server 01",
    type: "folder",
    children: [
      {
        id: "db1",
        name: "Database Alpha",
        type: "folder",
        children: [
          {
            id: "lr1",
            name: "Laundry Room 101",
            type: "folder",
            children: [
              { id: "wm1", name: "Washing Machine 01", type: "file" },
              { id: "wm2", name: "Washing Machine 02", type: "file" },
              { id: "dr1", name: "Dryer 01", type: "file" },
              { id: "dr2", name: "Dryer 02", type: "file" },
            ],
          },
          {
            id: "lr2",
            name: "Laundry Room 102",
            type: "folder",
            children: [
              { id: "wm3", name: "Washing Machine 03", type: "file" },
              { id: "wm4", name: "Washing Machine 04", type: "file" },
              { id: "dr3", name: "Dryer 03", type: "file" },
            ],
          },
        ],
      },
      {
        id: "db2",
        name: "Database Beta",
        type: "folder",
        children: [
          {
            id: "lr3",
            name: "Laundry Room 201",
            type: "folder",
            children: [
              { id: "wm5", name: "Washing Machine 05", type: "file" },
              { id: "wm6", name: "Washing Machine 06", type: "file" },
              { id: "dr4", name: "Dryer 04", type: "file" },
              { id: "dr5", name: "Dryer 05", type: "file" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "server2",
    name: "Server 02",
    type: "folder",
    children: [
      {
        id: "db3",
        name: "Database Gamma",
        type: "folder",
        children: [
          {
            id: "lr4",
            name: "Laundry Room 301",
            type: "folder",
            children: [
              { id: "wm7", name: "Washing Machine 07", type: "file" },
              { id: "wm8", name: "Washing Machine 08", type: "file" },
              { id: "dr6", name: "Dryer 06", type: "file" },
            ],
          },
          {
            id: "lr5",
            name: "Laundry Room 302",
            type: "folder",
            children: [
              { id: "wm9", name: "Washing Machine 09", type: "file" },
              { id: "wm10", name: "Washing Machine 10", type: "file" },
              { id: "dr7", name: "Dryer 07", type: "file" },
              { id: "dr8", name: "Dryer 08", type: "file" },
            ],
          },
        ],
      },
    ],
  },
];
