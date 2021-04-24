import React from 'react'
import { Story } from '@storybook/react'
import { withNextRouter } from 'storybook-addon-next-router'

import Layout, { Props } from '@c/layout/layout'

export default {
  title: 'Components/Layout',
  component: Layout,
  decorators: [withNextRouter],
}

const Template: Story<Props> = (args) => <Layout {...args} />

export const Default = Template.bind({})

export const WithText = () => (
  <Layout>
    <div className="text-white">
      HEY! Good morning.. I have a question about that. Are you a writer or do you want to be a
      writer? If so, don't rush to write a quick article. Because a writer has to write well as well
      as quickly. The former is ascension, while the latter is the foundation. To do both, you need
      to accumulate more: 1. Observe more. The article is the product of the objective things
      reflected in the author's head and head. It is only by careful observation that one finds in
      the mines of life the uncut jasper, and snatches among the mud the glittering treasure. 2.
      Read more. Extensive reading is a prerequisite for improving the level of composition. To
      write good articles, one must read more books. "Reading break ten thousand volumes, write like
      a god." We emphasize not only to read more, but also to choose to read, but also to read, to
      understand the structure of the article, language characteristics, from which to master the
      composition set more profound, more changes.
    </div>
  </Layout>
)
