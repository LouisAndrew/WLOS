from functools import reduce
import os


# global variables..
componentPath = ''
componentName = ''
withCss = False
withUnitTest = False
withStorybook = False
DEBUG = False


def pascalCase(name: str) -> str:
    return reduce(lambda a, b: a + b, list(map(lambda s: s[0].upper() + s[1:].lower(), name.split('-'))))


def entryFileSnippet(name: str) -> str:
    pascalCaseName = pascalCase(name)
    return '''import {pascalCaseName} from './{name}'

export {{ {pascalCaseName} }}'''.format(pascalCaseName=pascalCaseName, name=name)


def testFileSnippet(name: str, path: str) -> str:
    pascalCaseName = pascalCase(name)

    return '''import {{ render }} from '@testing-library/react'
import {{ {pascalCaseName} }} from '{basePath}'

describe('', () => {{
    it('', () => {{}})
}})'''.format(pascalCaseName=pascalCaseName, basePath=getBasePath(path, True))


def storyFileSnippet(name: str, path: str) -> str:
    pascalCaseName = pascalCase(name)
    title = reduce(lambda a, b: a + "/" + b, list(map(lambda a: reduce(
        lambda c, d: c + " " + d, (a[0].upper() + a[1:]).split('-')), path.replace('./', '').split('/'))))

    return '''import React from 'react'
import {{ Story }} from '@storybook/react'

import {pascalCaseName}, {{ Props }} from '{basePath}'

export default {{
    title: '{title}',
    component: {pascalCaseName}
}}

const Template: Story<Props> = (args) => (
    <{pascalCaseName} {{...args}} />
)

export const Default = Template.bind({{}})'''.format(pascalCaseName=pascalCaseName, title=title, basePath=getBasePath(path, True) + "/" + name)


def getBasePath(path: str, absolute: bool) -> str:

    def reducer(l: list) -> str:
        print(l)
        return reduce(lambda a, b: a + "/" + b, l)

    basePath = path.split('/')
    basePath.pop(0)
    if (not absolute):
        if (not basePath.__contains__('views')):
            basePath.pop(0)  # delete baseFolder
        return reducer(basePath)  # input/src-input -> input

    folder = basePath[0]
    if (folder == 'components'):
        basePath[0] = '@c'
    elif (folder == 'views'):
        basePath[0] = '@v'

    return reducer(basePath)


def componentFileSnippet(name: str) -> str:
    pascalCaseName = pascalCase(name)
    return '''import React, {{ FC }} from 'react';

export type Props = {{}}

const {pascalCaseName}: FC<Props> = () => {{
    return <div data-testid="{name}-wrapper" />
}}

export default {pascalCaseName}'''.format(pascalCaseName=pascalCaseName, name=name)


def logger(text: str):
    print('\x1b[6;30;42m' + text + '\x1b[0m')


def askInput():
    global componentPath, componentName, withCss, withUnitTest, withStorybook

    logger('Enter component path?')
    componentPath = input()
    logger('Enter component name?')
    componentName = input()
    withUnitTest = yesNoInput('Create unit test?')
    withCss = yesNoInput('Create CSS file?')
    withStorybook = yesNoInput('Create Story?')


def yesNoInput(text: str) -> str:
    ans = '?'
    while not ans in ['y', 'n', 'N', 'Y', '', 'yes', 'Yes', 'no', 'No']:
        logger(text + ' (Y/n)')
        ans = input()

    return ans in ['y', 'Y', '', 'yes', 'Yes']


def createList(path: str, name: str, css: bool, test: bool, story: bool):
    l = []
    # append entry file
    l.append([path + "/index.ts", entryFileSnippet(name)])
    # append component file
    l.append([path + "/" + name + ".tsx", componentFileSnippet(name)])

    if (css):
        l.append([path + "/" + name + ".module.css", ""])

    if (test):
        testPath = "./tests/"
        pathTemp = getBasePath(path, False) + ".test.tsx"
        l.append([testPath + pathTemp, testFileSnippet(name, path)])

    if (story):
        storyPath = "./stories"
        pathTemp = getBasePath(path, False) + ".stories.tsx"
        l.append([storyPath + "/" + pathTemp, storyFileSnippet(name, path)])

    return l


def createBaseFiles(l):
    listTyped = l  # type: list[list[str]]
    global DEBUG

    def createSingleFile(arr):
        path = arr[0]
        snippet = arr[1]
        if (not DEBUG):
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w") as f:
                f.write(snippet)
        return path

    return map(lambda arr: createSingleFile(arr), listTyped)


def run():
    global componentPath, componentName, withCss, withUnitTest, withStorybook
    if not componentPath.__contains__(componentName):
        componentPath = componentPath + "/" + componentName
    if not componentPath.__contains__("./"):
        componentPath = "./" + componentPath
    l = createList(componentPath, componentName,
                   withCss, withUnitTest, withStorybook)
    paths = list(createBaseFiles(l))
    logger('created paths:' + ''.join("\n" + str(item) for item in paths))


askInput()
run()
